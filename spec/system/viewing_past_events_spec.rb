# frozen_string_literal: true
require 'rails_helper'

describe 'Past events', type: :system do

  let!(:event1) { create :event, title: 'Ruby for newbies' }
  let!(:event2) { create :event, title: 'Ruh-roh Ruby: tales of concurrency gone bad'}
  let!(:event3) { create :event, title: 'Weekly gripe & type'}

  it 'filters events' do
    Event.reindex
    visit meetups_path

    fill_in 'Meetup Name', with: 'ruby'
    click_button 'Filter'

    expect(page).to have_text(event1.title)
    expect(page).to have_text(event2.title)
    expect(page).not_to have_text(event3.title)
  end
end
