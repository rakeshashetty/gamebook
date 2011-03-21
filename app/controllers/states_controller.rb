class StatesController < ApplicationController
  before_filter :get_country
  layout nil, :only=>['get_states_for_country']
  def get_states_for_country
    @states=@country.states
  end

  private

  def get_country
    @country = Country.find(params[:country_id])
  end

end
