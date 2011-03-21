class CreateCourses < ActiveRecord::Migration
  def self.up
    create_table :courses do |t|
      t.string :club
      t.string :name
      t.integer :country_id
      t.integer :state_id
      t.integer :city_id
      t.integer :holes
      t.integer :par
      t.integer :user_id
      t.timestamps
    end
  end

  def self.down
    drop_table :courses
  end
end
