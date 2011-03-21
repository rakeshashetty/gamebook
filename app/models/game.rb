class Game < ActiveRecord::Base
  belongs_to :course
  belongs_to :group
  belongs_to :user

  def self.collect_players_from_the_selected_group_for_the_game(game_id)
     players = self.find_by_game_id
  end

  def self.played_by_current_user(user)
		 groups = user.groups.collect{|d| d.id}
		 self.find(:all,:conditions => ["group_id in (?)",groups])
	end
end
