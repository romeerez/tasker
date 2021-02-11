const removePlugins = [
  'CaseSensitivePathsPlugin',
  'ESLintWebpackPlugin',
  'IgnorePlugin',
]

module.exports = function override(config, env) {
  config.plugins = config.plugins.filter(
    (plugin) => !removePlugins.includes(plugin.constructor.name),
  )

  return config
}
