require "test_helper"

class InstallGeneratorTest < Rails::Generators::TestCase
  tests InstallGenerator
  destination File.expand_path("../../tmp", __FILE__)
  setup :prepare_destination
  
  test "it creates all files properly" do
    run_generator
    assert_file "public/javascripts/jquery.nested-fields.js" if Rails.version < "3.1"
  end
  
end
