class CreateCourseHoles < ActiveRecord::Migration
  def self.up
    create_table :course_holes do |t|
      t.string :name
      t.integer :par
      t.integer :course_id
      t.integer :mens_hcp
      t.integer :ladies_hcp

      t.timestamps
    end
  end

  def self.down
    drop_table :course_holes
  end
end
