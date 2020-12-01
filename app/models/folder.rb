class Folder < ApplicationRecord
  has_many :tasks, dependent: :destroy
end
