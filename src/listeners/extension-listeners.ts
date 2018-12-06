enum Listeners {
  OnDidChangeConfiguration,
  OnDidChangeTextDocument,
  OnDidChangeWorkspaceFolders,
  OnDidCloseTextDocument,
  OnDidOpenTextDocument,
  OnDidSaveTextDocument,
  OnWillSaveTextDocument
}

const getListener = (key: number): string => {
  const rawValue = Listeners[key];

  return rawValue.slice(0, 1).toLowerCase() + rawValue.slice(1);
};

export { Listeners, getListener };
