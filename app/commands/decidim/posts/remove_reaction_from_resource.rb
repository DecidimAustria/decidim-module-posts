# frozen_string_literal: true

module Decidim
  module Posts
    # A command with all the business logic to remove a reaction from a resource, both as a user or as a user_group.
    class RemoveReactionFromResource < Decidim::Command
      # Public: Initializes the command.
      #
      # resource     - A Decidim::Posts::Reactionable object.
      # current_user - The current user.
      # current_group- (optional) The current_group that is unendorsing the Resource.
      def initialize(resource, current_user, current_group = nil)
        @resource = resource
        @current_user = current_user
        @current_group = current_group
      end

      # Executes the command. Broadcasts these events:
      #
      # - :ok when everything is valid, together with the resource.
      # - :invalid if the form was not valid and we could not proceed.
      #
      # Returns nothing.
      def call
        destroy_resource_reaction
        broadcast(:ok, @resource)
      end

      private

      def destroy_resource_reaction
        query = if @current_group.present?
                  @resource.reactions.where(decidim_user_group_id: @current_group&.id)
                else
                  @resource.reactions.where(author: @current_user, decidim_user_group_id: 0)
                end
        query.destroy_all
      end
    end
  end
end
