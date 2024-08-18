class CreateDecidimPostsUserAnswers < ActiveRecord::Migration[6.1]
  def change
    create_table :decidim_posts_user_answers do |t|
      t.belongs_to :decidim_posts_answer, null: false, foreign_key: true
      t.belongs_to :decidim_user, null: false, foreign_key: true

      t.timestamps
    end
  end
end