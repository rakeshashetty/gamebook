module ApplicationHelper

  def get_dropdown_options(object)
   [["Select #{object[0].type.to_s.singularize.camelize}",0]] +  object.collect{|c| [c.name,c.id]}
  end

  def get_options(object)
    get_dropdown_options(object).collect { |o| "<option value=#{o[1]}>#{o[0]}</option>"}.join('').html_safe
  end
end
