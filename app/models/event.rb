# frozen_string_literal: true

class Event < ApplicationRecord
  searchkick

  has_many :event_speakers, dependent: :destroy
  has_many :speakers, through: :event_speakers

  validates :title, :location, :date, presence: true
end
