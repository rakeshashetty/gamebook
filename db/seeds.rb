# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)


countries = {"India" => { "Karnataka" => ["bangalore","mangalore"] , "AP" => ["hyderabad"]} , "United States" => {"California" => ["Los Angeles","California City"]}}

countries.each do |country,states|
  c = Country.create(:name => country)
  states.each do |state,cities|
      s=State.create(:name => state,:country_id=>c.id)
      cities.each do |city|
        City.create(:name => city,:state_id=>s.id)
      end
  end
end