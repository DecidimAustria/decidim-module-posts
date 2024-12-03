# frozen_string_literal: true

def initialize_homepage_content_blocks
  initializer "Feeds.content_blocks" do
    register_content_block(:homepage, :feeds_homepage)
    register_content_block(:assembly_homepage, :feeds_assembly_homepage)
    register_content_block(:participatory_process_homepage, :feeds_participatory_process_homepage)
    register_content_block(:participatory_process_group_homepage, :feeds_participatory_process_group_homepage)
  end
end


def register_content_block(component, type)
  Decidim.content_blocks.register(component, type) do |content_block|
    content_block.cell = "decidim/posts/content_blocks/posts"
    content_block.settings_form_cell = "decidim/posts/content_blocks/posts_settings_form"
    content_block.public_name_key = "decidim.posts.content_blocks.posts.name"

    content_block.settings do |settings|
      settings.attribute :component_id, type: :integer
    end
  end
end