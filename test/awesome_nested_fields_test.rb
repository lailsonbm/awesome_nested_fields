require 'test_helper'

class AwesomeNestedFieldsTest < ActiveSupport::TestCase
  test "it has a version" do
    version = AwesomeNestedFields::VERSION
    assert_match version, /^\d+\.\d+\.\d+$/
    assert_not_nil version
  end
  
  test "it can escape HTML content" do
    escaped_content = AwesomeNestedFields.escape_html_tags("Home > News & Updates")
    assert_equal escaped_content, "Home &gt; News &amp; Updates" 
  end
end
