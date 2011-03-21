class WelcomeController < ApplicationController
  def index
		@selected_game = Game.played_by_current_user(self.current_user)
	end
end
