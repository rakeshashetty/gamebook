class CitiesController < ApplicationController
  before_filter :get_state
  layout nil, :only=>['get_cities_for_state']

  def get_cities_for_state
    @cities=@state.cities
  end

  private

  def get_state
    @state = State.find(params[:state_id])
  end

end
