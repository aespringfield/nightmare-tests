# frozen_string_literal: true
require 'rails_helper'

RSpec.describe 'Managing events', type: :system do
  let!(:event) { create :event }
  let(:user) { create :user, :admin }

  it 'can delete events' do
    login_as user
    visit admin_events_path
    expect(page).to have_text(event.title)

    click_link_or_button 'Delete'
    expect(page).to have_text('Event successfully deleted')
    expect(page).not_to have_text(event.title)
  end

  it 'can edit events' do
    login_as user
    visit edit_admin_event_path(event)

    fill_in 'Title', with: 'Some new title'
    click_link_or_button 'Save'
    expect(Event.last.title).to eq('Some new title')
  end

  it 'can create events' do
    login_as user
    visit new_admin_event_path

    fill_in 'Title', with: 'Some title'
    fill_in 'Description', with: 'It will be fun!'
    click_link_or_button 'Save'
    expect(Event.last.title).to eq('Some title')
    expect(Event.last.description).to eq('It will be fun!')
  end
end
