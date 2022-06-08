# frozen_string_literal: true
FactoryBot.define do
  factory :job do
    company { Faker::Company.name }
    title { Faker::Job.title }
    description { Faker::Company.catch_phrase }
    link { Faker::Internet.url }
    location { Faker::Address.city }
    image_url { Faker::Company.logo }
    sponsorship_level { 0 }
  end
end
