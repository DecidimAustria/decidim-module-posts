class AddTitleToQuestion < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_questions, :title, :jsonb
  end
end
