class RemoveTitleFromQuestion < ActiveRecord::Migration[6.1]
  def change
    remove_column :decidim_posts_questions, :title, :string
  end
end
  