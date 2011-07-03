module AwesomeNestedFields
  if ::Rails.version < '3.1'
    require 'awesome_nested_fields/railtie'
  else
    require 'awesome_nested_fields/engine'
  end
  
  require 'awesome_nested_fields/version'
end
