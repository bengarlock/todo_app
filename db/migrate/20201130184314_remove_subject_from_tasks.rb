class RemoveSubjectFromTasks < ActiveRecord::Migration[6.0]
  def change
    remove_column  :tasks, :subject
  end
end
