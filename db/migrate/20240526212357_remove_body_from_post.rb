class RemoveBodyFromPost < ActiveRecord::Migration[6.1]
  def change
    remove_column :decidim_posts_posts, :body, :string
  end
end
