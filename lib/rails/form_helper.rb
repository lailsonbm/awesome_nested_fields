ActionView::Helpers::FormBuilder.class_eval do
  def nested_fields_for(association, options={}, &block)
    raise ArgumentError, 'Missing block to nested_fields_for' unless block_given?
    
    options[:new_item_index] ||= 'new_nested_item'
    options[:new_object] ||= self.object.class.reflect_on_association(association).klass.new
    options[:item_template_class] ||= 'template item'
    options[:empty_template_class] ||= 'template empty'
    options[:show_empty] ||= false
    
    output = @template.capture { fields_for(association, &block) }
    
    if options[:show_empty] and self.object.send(association).empty?
      output.safe_concat @template.capture { yield nil } 
    end
    
    output.safe_concat nested_fields_templates(association, options, &block)
    
    output
  end

private
  def nested_fields_templates(association, options, &block)
    templates = @template.content_tag(:script, type: 'text/html', class: options[:item_template_class]) do
      fields_for(association, options[:new_object], child_index: options[:new_item_index], &block)
    end
    
    if options[:show_empty]
      templates.safe_concat @template.content_tag(:script, type: 'text/html', class: options[:empty_template_class], &block)
    end
    
    templates
  end
end