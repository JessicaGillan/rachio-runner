Rails.application.routes.draw do
  devise_for :users
  root 'static_pages#index'

  # TODO delete this line
  resource :static_pages, only: [:show]
end
