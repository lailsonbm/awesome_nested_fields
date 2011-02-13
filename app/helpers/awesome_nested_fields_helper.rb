module AwesomeNestedFieldsHelper
  def nested_fields_items(builder, association, options={})
    options = nested_fields_process_default_options(options, builder, association)

    items = ''
    builder.fields_for(association) do |f|
      items << render(options[:partial], options[:builder_local] => f)
    end

    if options[:none_partial] and builder.object.send(association).empty?
      items << render(options[:none_partial])
    end

    items.html_safe
  end

  def nested_fields_template(builder, association, options={})
    options = nested_fields_process_default_options(options, builder, association)

    templates = content_tag(:script, type: 'text/html', class: options[:item_template_class]) do
      builder.fields_for(association, options[:new_object], child_index: options[:new_item_index]) do |f|
        render(options[:partial], options[:builder_local] => f)
      end
    end

    if options[:none_partial]
      templates << content_tag(:script, type: 'text/html', class: options[:none_template_class]) do
        builder.fields_for(association, options[:new_object], child_index: options[:new_item_index]) do |f|
          render(options[:none_partial], options[:builder_local] => f)
        end
      end
    end

    templates.html_safe
  end

protected
  def nested_fields_process_default_options(options, builder, association)
    options[:new_object] ||= builder.object.class.reflect_on_association(association).klass.new
    options[:partial] ||= association.to_s.singularize
    options[:builder_local] ||= :f
    options[:item_template_class] ||= 'template item'
    options[:none_template_class] ||= 'template none'
    options[:new_item_index] ||= 'new_nested_item'
    options
  end
end