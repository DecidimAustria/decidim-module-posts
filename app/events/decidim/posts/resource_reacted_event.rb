# frozen_string_literal: true

module Decidim
  module Posts
    class ResourceReactedEvent < Decidim::Events::SimpleEvent
      i18n_attributes :reactor_nickname, :reactor_name, :reactor_path, :nickname, :resource_type

      delegate :nickname, :name, to: :reactor, prefix: true

      def nickname
        reactor_nickname
      end

      def reactor_path
        reactor.profile_path
      end

      def resource_text
        return resource.body if resource.respond_to? :body
        return resource.description if resource.respond_to? :description
      end

      def resource_type
        resource.class.model_name.human
      end

      private

      def reactor
        @reactor ||= Decidim::UserPresenter.new(reactor_user)
      end

      def reactor_user
        @reactor_user ||= Decidim::User.find_by(id: extra[:reactor_id])
      end
    end
  end
end