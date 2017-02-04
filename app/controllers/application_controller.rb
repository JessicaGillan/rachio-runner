class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  # Require login for the entire app, state exceptions individually
  before_action :authenticate_user!
end
