class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table "users" do |t|
      t.column :login,                     :string, :limit => 40
      t.column :email,                     :string, :limit => 100
      t.column :crypted_password,          :string, :limit => 40
      t.column :first_name,                :string, :limit => 40, :default => '', :null => true
      t.column :last_name,                 :string, :limit => 40, :default => '', :null => true
      t.column :country_id,                :integer
      t.column :handicap,                  :decimal , :precision => 5, :scale => 2
      t.column :gender,                    :boolean
      t.column :privacy,                   :boolean
      t.column :salt,                      :string, :limit => 40
      t.column :created_at,                :datetime
      t.column :updated_at,                :datetime
      t.column :remember_token,            :string, :limit => 40
      t.column :remember_token_expires_at, :datetime


    end
    add_index :users, :login, :unique => true
  end

  def self.down
    drop_table "users"
  end
end
