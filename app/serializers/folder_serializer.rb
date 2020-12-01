class FolderSerializer < ActiveModel::Serializer
  attributes :id, :name, :tasks, :created_at, :updated_at
end
