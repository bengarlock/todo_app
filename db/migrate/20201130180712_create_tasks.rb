class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks do |t|
      t.string :date
      t.string :name
      t.string :subject
      t.string :notes

      t.timestamps
    end
  end
end
