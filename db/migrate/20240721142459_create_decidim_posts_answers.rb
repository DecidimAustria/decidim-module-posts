class CreateDecidimPostsAnswers < ActiveRecord::Migration[6.1]
  def change
    create_table :decidim_posts_answers do |t|
      t.belongs_to :decidim_posts_question, null: false, foreign_key: true
      t.string :title

      t.timestamps
    end
  end
end
