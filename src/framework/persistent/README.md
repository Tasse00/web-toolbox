# Persistent Data

```tsx
const App = () => {
  const config = {
    mode: "mongodb",
    url: "http://user:passwd@localhost:8777/mydb/mycollection",
  };

  return (
    <PersistentProvider src={config}>
      <App1 />
    </PersistentProvider>
  );
};
```

```tsx
const App1 = () => {
  const [loading, value, update] = usePersistent("key.path", "DEFAULT");

  return (
    <AppContainer>
      <Card loading={loading}>{value}</Card>
      <Button loading={loading} onClick={() => update(loading + "1")}>
        Update
      </Button>
    </AppContainer>
  );
};
```

## ConfigProvider

1. MetaConfig => localstorage

store config source

2. ConfigProvider => configured source
