module AwesomeNestedFields
  class Railtie < ::Rails::Railtie
    if Rails.version >= "3.1"
      config.before_configuration do
        config.action_view.javascript_expansions[:defaults] << 'jquery.nested-fields'
      end
    else
      config.before_configuration do
        config.action_view.javascript_expansions[:defaults] << 'jquery.nested-fields.min'
      end
    end
  end
end
