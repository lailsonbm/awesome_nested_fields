module AwesomeNestedFields
  class Engine < Rails::Engine
    initializer 'awesome_nested_fields.add_middleware' do |app|
      app.middleware.use ActionDispatch::Static, "#{root}/public"
    end

    config.to_prepare do
      ApplicationController.helper(AwesomeNestedFieldsHelper)
    end
  end
end
