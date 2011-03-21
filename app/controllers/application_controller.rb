class ApplicationController < ActionController::Base
  include AuthenticatedSystem
  before_filter :login_required ,:get_countries ,:get_states ,:get_cities

  protect_from_forgery

  private

  def get_countries
    @countries = Country.all
  end
  def get_states
    @states = State.all
  end
  def get_cities
    @cities = City.all
  end
  
end
