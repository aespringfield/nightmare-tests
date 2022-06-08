# frozen_string_literal: true
require 'rails_helper'

describe 'Job board', type: :system do

  let!(:job1) { create :job, company: "Black Sheep Pizza", created_at: 1.day.ago }
  let!(:job2) { create :job, company: "Anchor Fish & Chips", created_at: 2.days.ago }
  let!(:job3) { create :job, company: "Peninsula Malaysian Cuisine", created_at: 3.days.ago }

  before do
    @old_job_board_pass = ENV['JOB_BOARD_PASSWORD']
    @old_jwt_secret = ENV['JWT_HMAC_SECRET']
    ENV['JOB_BOARD_PASSWORD'] = 'fakepass'
    ENV['JWT_HMAC_SECRET'] = '1234567'
  end

  after do
    ENV['JOB_BOARD_PASSWORD'] = @old_job_board_pass
    ENV['JWT_HMAC_SECRET'] = @old_jwt_secret
  end

  # add slo-mo
  it 'sorts jobs' do
    visit jobs_path

    fill_in 'Password', with: ENV['JOB_BOARD_PASSWORD']
    click_button 'View Job Board'

    # should initially be ordered by most recent to least recent
    job_cards = all('.job-card')
    expect(job_cards[0]).to have_text(job1.title)
    expect(job_cards[1]).to have_text(job2.title)
    expect(job_cards[2]).to have_text(job3.title)

    select 'Sort by: Company', from: 'Sort jobs'

      within('.job-card', match: :first) { expect(page.text).to eq(job2.company) }

    # aggregate_failures do
    # DOES NOT FAIL
    #   within('#job-card-0') {
    #     expect(page).to have_text(job2.company)
    #   }
    # DOES FAIL
    #   expect(find('#job-card-0 .company').text).to eq(job2.company)
    # DOES FAIL
    #   expect(all('.job-card').first).to have_text(job2.company)
    # end

    # DOES FAIL
    # job_cards = all('.job-card')
    # [job2, job1, job3].each_with_index do |job, i|
    #   expect(job_cards[i]).to have_text(job.company)
    # end


    select 'Sort by: Most recent', from: 'Sort jobs'


  end
end

def get_jobs
  find('.job-card')
end
