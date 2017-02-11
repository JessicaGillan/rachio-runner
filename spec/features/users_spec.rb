require 'rails_helper'

feature "Authentication" do
  let(:user){ create(:user) }

  context "Sign In" do
    scenario "with invalid credentials" do
      user.email = user.email + "asdf"
      sign_in(user)
      expect(page).to have_content "Invalid Email or password."
    end

    scenario "with valid credentials" do
      sign_in(user)
      expect(page).to have_content "Signed in successfully."
    end
  end

  context "Sign Out" do
    before do
      sign_in(user)
    end

    scenario "Sign out from navbar" do
      click_link "Log out"
      expect(page).to have_content "Log in"
    end
  end
end
