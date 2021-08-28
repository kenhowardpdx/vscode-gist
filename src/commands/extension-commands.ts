enum GistCommands {
  Add = 'extension.gist.add',
  Create = 'extension.gist.create',
  CreateConfirmation = 'extension.gist.createConfirmation',
  Delete = 'extension.gist.delete',
  DeleteFile = 'extension.gist.deleteFile',
  Insert = 'extension.gist.insert',
  InsertFavorite = 'extension.gist.insertFavorite',
  Open = 'extension.gist.open',
  OpenFavorite = 'extension.gist.openFavorite',
  OpenInBrowser = 'extension.gist.openInBrowser',
  UpdateAccessKey = 'extension.gist.updateAccessKey'
}

enum ProfileCommands {
  Create = 'extension.profile.create',
  Select = 'extension.profile.select'
}

enum StatusBarCommands {
  Update = 'extension.status.update'
}

export { GistCommands, ProfileCommands, StatusBarCommands };
