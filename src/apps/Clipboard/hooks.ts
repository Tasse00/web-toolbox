// 维持

import { useCallback, useEffect, useRef, useState } from "react";

export interface ShareWithPeer extends ClipboardShare {
  identity: string;
}

export type SignalingSendMessage = SSMIceCandidate | SSMOffer | SSMAnswer;
export interface SSMIceCandidate {
  type: "iceCandidate";
  payload: {
    peerConnId: number;
    iceCandidate: string;
  };
}
export interface SSMOffer {
  type: "offer";
  payload: {
    peerConnId: number;
    offer: string;
  };
}
export interface SSMAnswer {
  type: "answer";
  payload: {
    peerConnId: number;
    answer: string;
  };
}

export type ClipboardShare = CSText;
export type SendClipboardShare = Omit<CSText, "timestamp">;
export interface CSText {
  type: "text";
  content: string;
  timestamp: number;
}

export type DataChannelMessage = DCMIdentity | DCMTextShare;
export interface DCMIdentity {
  type: "identity";
  payload: string;
}

export interface DCMTextShare {
  type: "share.text";
  payload: string;
}

// 通过 iter 值来更新
export interface PeersManagerState {
  peers: PeerState[];
  shares: ShareWithPeer[];

  share: (s: SendClipboardShare) => any;
  createPeer: (peerConnId: number) => any;
  removePeer: (peerConnId: number) => any;
  processOffer: (peerConnId: number, offer: string) => any;
  processAnswer: (peerConnId: number, answer: string) => any;
  processIceCandidate: (peerConnId: number, candidate: string) => any;
}

export interface Peer {
  peerConnId: number;
  identity: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
  shares: ClipboardShare[];
}

export interface PeerState {
  peerConnId: number;
  identity: string;
  shares: ClipboardShare[];

  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  iceGatheringState: RTCIceGathererState;
  signalingState: RTCSignalingState;
  dataChannelState: RTCDataChannelState;
}

export interface UsePeersManagerOptions {
  sendToSignalingServer: (act: SignalingSendMessage) => void;
  identity: string;
}
export function usePeersManager({
  sendToSignalingServer,
  identity,
}: UsePeersManagerOptions): PeersManagerState {
  const setIter = useState(0)[1];
  const update = useCallback(() => setIter((i) => i + 1), [setIter]);

  const peersRef = useRef<Peer[]>([]);

  const sendDCM = useCallback((peerConnId: number, dcm: DataChannelMessage) => {
    const peer = peersRef.current.find((p) => p.peerConnId === peerConnId);
    if (peer && peer.dataChannel && peer.dataChannel.readyState === "open") {
      peer.dataChannel.send(JSON.stringify(dcm));
      console.log("sendDCM sent", dcm, peer);
    } else {
      console.log("sendDCM not sent", dcm, peer);
    }
  }, []);

  useEffect(() => {
    peersRef.current.forEach(({ peerConnId, connection, dataChannel }) => {
      connection.onicecandidate = ({ candidate }) => {
        if (candidate) {
          sendToSignalingServer({
            type: "iceCandidate",
            payload: { peerConnId, iceCandidate: JSON.stringify(candidate) },
          });
        }
      };
    });
  }, [sendToSignalingServer]);

  const processOffer = useCallback(
    (peerConnId: number, offer: string) => {
      // 1. 建立新的连接
      const peer = createPeerConnection(
        peerConnId,
        sendToSignalingServer,
        update
      );

      peer.connection.ondatachannel = ({ channel }) => {
        if (channel.label === "communicate") {
          peer.dataChannel = channel;

          setupDataChannel(peer, sendDCM, identity, update);

          update();
        }
      };

      peersRef.current.push(peer);

      // 处理offer, 发出answer
      peer.connection
        .setRemoteDescription(JSON.parse(offer))
        .then(() => peer.connection.createAnswer())
        .then((answer) => {
          peer.connection.setLocalDescription(answer);
          sendToSignalingServer({
            type: "answer",
            payload: { peerConnId, answer: JSON.stringify(answer) },
          });
        });
    },
    [peersRef, sendToSignalingServer, update, sendDCM, identity]
  );

  const processAnswer = useCallback((peerConnId: number, answer: string) => {
    const conn = peersRef.current.find((p) => p.peerConnId === peerConnId);
    if (conn) {
      conn.connection.setRemoteDescription(JSON.parse(answer));
    }
  }, []);

  const createPeer = useCallback(
    (peerConnId: number) => {
      // 1. 建立新的连接
      const peer = createPeerConnection(
        peerConnId,
        sendToSignalingServer,
        update
      );
      peer.dataChannel = peer.connection.createDataChannel("communicate");
      setupDataChannel(peer, sendDCM, identity, update);
      peersRef.current.push(peer);

      // 处理offer, 发出answer
      peer.connection
        .createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false })
        .then((offer) => {
          peer.connection.setLocalDescription(offer);
          sendToSignalingServer({
            type: "offer",
            payload: {
              peerConnId,
              offer: JSON.stringify(offer),
            },
          });
        });
    },
    [sendToSignalingServer, identity, update, sendDCM]
  );
  const removePeer = useCallback(
    (peerConnId: number) => {
      const peerIdx = peersRef.current.findIndex(
        (p) => p.peerConnId === peerConnId
      );
      if (peerIdx > -1) {
        peersRef.current[peerIdx].dataChannel?.close();
        peersRef.current[peerIdx].connection.close();
        peersRef.current.splice(peerIdx, 1);
        update();
      }
    },
    [update]
  );
  const processIceCandidate = useCallback(
    (peerConnId: number, iceCandidate: string) => {
      const conn = peersRef.current.find((p) => p.peerConnId === peerConnId);
      if (conn) {
        conn.connection.addIceCandidate(JSON.parse(iceCandidate));
      }
    },
    []
  );

  useEffect(() => {
    const curr = peersRef.current;
    const sentShares = sentSharesRef.current;
    return () => {
      for (let peer of curr) {
        peer.dataChannel?.close();
        peer.connection.close();
      }
      curr.splice(0, curr.length);
      sentShares.splice(0, sentShares.length);
    };
  }, []);
  const sentSharesRef = useRef<ClipboardShare[]>([]);

  const share = useCallback(
    (s: SendClipboardShare) => {
      sentSharesRef.current.push({
        ...s,
        timestamp: new Date().valueOf(),
      });

      let dcm: DataChannelMessage | undefined;
      switch (s.type) {
        case "text":
          dcm = { type: "share.text", payload: s.content };
          break;
        default:
          console.warn("unknown send share data", s);
          break;
      }
      if (dcm) {
        for (let peer of peersRef.current) {
          sendDCM(peer.peerConnId, dcm);
        }
      }

      update();
    },
    [sendDCM, update]
  );

  const broadcastIdentity = useCallback(
    (identity: string) => {
      for (let peer of peersRef.current) {
        sendDCM(peer.peerConnId, { type: "identity", payload: identity });
      }
    },
    [sendDCM]
  );

  const shares: ShareWithPeer[] = [];
  for (const p of peersRef.current) {
    for (const share of p.shares) {
      shares.push({
        ...share,
        identity: p.identity,
      });
    }
  }
  for (const s of sentSharesRef.current) {
    shares.push({ ...s, identity });
  }
  useEffect(() => {
    if (identity) {
      broadcastIdentity(identity);
    }
  }, [identity, broadcastIdentity]);
  return {
    shares: shares.sort((a, b) => b.timestamp - a.timestamp),
    peers: peersRef.current.map(formatPeerState),

    share,
    createPeer,
    removePeer,
    processOffer,
    processAnswer,
    processIceCandidate,
  };
}

// logic

function setupDataChannel(
  peer: Peer,
  sendDCM: (peerConnId: number, dcm: DataChannelMessage) => any,
  identity: string,
  update: () => any
) {
  if (peer.dataChannel) {
    peer.dataChannel.onclose = () => {
      console.log("DataChannel close", peer);
      update(); // 更新状态
    };
    peer.dataChannel.onerror = (err) => {
      console.log("DataChannel error", peer, err);
      update(); // 更新状态
    };
    peer.dataChannel.onopen = () => {
      console.log("DataChannel open", peer);
      sendDCM(peer.peerConnId, {
        type: "identity",
        payload: identity,
      });
      update(); // 更新状态
    };

    peer.dataChannel.onmessage = (e) => {
      console.log("DataChannel message", e);

      if (typeof e.data === "string") {
        const msg: DataChannelMessage = JSON.parse(e.data);
        switch (msg.type) {
          case "identity":
            console.log("DataChannel recv identity", msg.payload);
            peer.identity = msg.payload;
            break;
          case "share.text":
            console.log("DataChannel recv share.text", msg.payload);
            peer.shares = [
              ...peer.shares,
              {
                type: "text",
                content: msg.payload,
                timestamp: new Date().valueOf(),
              },
            ];
            break;
          default:
            console.warn("unkown DataChannel Message", msg);
        }
        update();
      } else {
        console.warn("unexpected data from communicate channel", e.data);
      }
    };
  }
}

function createPeerConnection(
  peerConnId: number,
  sendToSignalingServer: UsePeersManagerOptions["sendToSignalingServer"],
  update: () => any
) {
  const peer: Peer = {
    peerConnId,
    identity: peerConnId.toString(),
    shares: [],
    connection: new RTCPeerConnection({
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19302"],
        },
      ],
    }),
  };

  peer.connection.onconnectionstatechange = () => {
    console.log("connection", peer.connection.connectionState, peer);
    update();
  };
  peer.connection.oniceconnectionstatechange = () => {
    console.log("ice connection", peer.connection.connectionState, peer);
    update();
  };
  peer.connection.onicegatheringstatechange = () => {
    console.log("ice gathering", peer.connection.connectionState, peer);
    update();
  };
  peer.connection.onsignalingstatechange = () => {
    console.log("signaling", peer.connection.signalingState, peer);
    update();
  };

  // 交换 IceCandidate
  peer.connection.onicecandidate = ({ candidate }) => {
    if (candidate) {
      sendToSignalingServer({
        type: "iceCandidate",
        payload: { peerConnId, iceCandidate: JSON.stringify(candidate) },
      });
    }
  };
  return peer;
}
function formatPeerState(peer: Peer): {
  peerConnId: number;
  identity: string;
  shares: ClipboardShare[];

  connectionState: RTCPeerConnectionState;
  iceConnectionState: RTCIceConnectionState;
  iceGatheringState: RTCIceGathererState;
  signalingState: RTCSignalingState;
  dataChannelState: RTCDataChannelState;
} {
  return {
    peerConnId: peer.peerConnId,
    identity: peer.identity,
    shares: peer.shares,
    connectionState: peer.connection.connectionState,
    iceConnectionState: peer.connection.iceConnectionState,
    iceGatheringState: peer.connection.iceGatheringState,
    signalingState: peer.connection.signalingState,
    dataChannelState: peer.dataChannel?.readyState || "connecting",
  };
}
