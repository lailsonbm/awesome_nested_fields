module AwesomeNestedFields
  class Railtie < ::Rails::Railtie
    config.before_configuration do
      config.action_view.javascript_expansions[:defaults] << 'jquery.nested-fields'
    end
  end
end
