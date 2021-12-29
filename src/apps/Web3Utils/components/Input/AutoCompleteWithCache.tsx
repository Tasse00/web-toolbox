import { useCachedState } from '../../hooks/cache';
import React from 'react';
import { Row, Col, AutoComplete, Button } from 'antd';
import { unique } from '../../utils/array';

const AutoCompleteWithCache: React.FC<{
  storeKey: string;
  btnTxt?: string;
  validate?: (ipt: string) => boolean;
  onConfirm?: (value: string) => void;
}> = ({ storeKey, btnTxt = 'Ok', validate = () => true, onConfirm }) => {
  const [cachedValue, setCachedValue] = useCachedState<string[]>(storeKey, []);
  const [value, setValue] = React.useState('');
  const options = cachedValue
    .filter((c) => c.includes(value))
    .map((v) => ({ value: v }));
  return (
    <Row>
      <Col flex={1}>
        <AutoComplete
          placeholder="Contract Address"
          options={options}
          value={value}
          style={{ width: '100%' }}
          onChange={setValue}
          onSelect={v=>setValue(v.toString())}
        />
      </Col>
      <Col>
        <Button
          style={{ width: 120 }}
          type="primary"
          disabled={!validate(value)}
          onClick={() => {
            onConfirm && onConfirm(value);
            setCachedValue(unique([value, ...cachedValue]));
          }}
        >
          {btnTxt}
        </Button>
      </Col>
    </Row>
  );
};

export default AutoCompleteWithCache;
