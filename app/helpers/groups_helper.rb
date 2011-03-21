module GroupsHelper

def group_contains_user?(user)
    if @group
        @group.users.include?(user)
    else
        false
    end
end

end
