class CreateGames < ActiveRecord::Migration
  def self.up
    create_table :games do |t|
      t.integer :course_id
      t.integer :user_id
      t.integer :group_id
      t.integer :status
      t.timestamps
    end
  end

  def self.down
    drop_table :games
  end
end
