class FoldersController < ApplicationController

  def index
    @folders = Folder.all
    render json: @folders
  end

  def create
    @folder = Folder.create(folder_params)
  end

  private

  def folder_params
    params.require(:folder).permit(:name)
  end

end
