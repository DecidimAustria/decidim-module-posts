class RenameHvCategory < ActiveRecord::Migration[6.1]
  def change
    # Find all posts with category 'hv' and change it to 'host'
    Decidim::Posts::Post.where(category: 'hv').update_all(category: 'host')
  end
end
