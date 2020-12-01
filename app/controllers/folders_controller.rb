class FoldersController < ApplicationController

  def index
    @folders = Folder.all
    render json: @folders
  end

  def show
    @folder = Folder.find(params[:id])
    render json: @folder
  end

  def create
    @folder = Folder.create(folder_params)
    render json: @folder
  end

  def destroy
    @folder = Folder.find_by(params[:id])
    @folder.destroy!
    render json:{}
  end

  private

  def folder_params
    params.require(:folder).permit(:name)
  end

end
