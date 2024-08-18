class AddTotAnswersToDecidimPostsAnswers < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_answers, :tot_answers, :integer
  end
end
