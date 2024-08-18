class CreateDecidimFeedsQuestions < ActiveRecord::Migration[6.1]
  def change
    create_table :decidim_posts_questions do |t|
      t.belongs_to :decidim_posts_posts, null: false, foreign_key: true
      t.string :title
      t.integer :question_type

      t.timestamps
    end
  end
end
