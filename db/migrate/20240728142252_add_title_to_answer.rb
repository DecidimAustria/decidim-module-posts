class AddTitleToAnswer < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_answers, :title, :jsonb
  end
end
