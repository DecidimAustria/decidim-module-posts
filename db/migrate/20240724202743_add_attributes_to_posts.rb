class AddAttributesToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :decidim_posts_posts, :highlighted, :boolean, default: false
    add_column :decidim_posts_posts, :fixed, :boolean, default: false
    add_column :decidim_posts_posts, :status, :integer, default: 0
  end
end
