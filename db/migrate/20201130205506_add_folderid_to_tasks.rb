class AddFolderidToTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :folder_id, :integer
  end
end
