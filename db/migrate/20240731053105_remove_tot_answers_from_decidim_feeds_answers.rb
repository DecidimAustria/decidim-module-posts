class RemoveTotAnswersFromDecidimFeedsAnswers < ActiveRecord::Migration[6.1]
  def change
    remove_column :decidim_posts_answers, :tot_answers, :integer
  end
end
